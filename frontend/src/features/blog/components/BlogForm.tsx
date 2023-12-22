import { useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  addBlogAsync,
  getBlogs,
  isBlogsPending,
  updateBlogAsync,
} from "../blogSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { v4 as uuidv4 } from "uuid";

import { getUser } from "../../login/userSlice";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

interface Blog {
  _id: string;
  title: string;
  description: string;
  author?: string;
  createdAt?: string;
}
type Props = {
  blog?: Blog;
  isEditted?: boolean;
  onClose?: () => void;
};

export default function BlogForm(props: Props) {
  const { blog, onClose, isEditted } = props;
  const [blogId] = useState<string>(uuidv4());
  const user = useAppSelector(getUser);
  const isLoading = useAppSelector(isBlogsPending);

  const [formData, setFormData] = useState<Blog>({
    _id: !isEditted ? blogId : (blog?._id as any),
    title: !isEditted ? "" : (blog?.title as any),
    description: !isEditted ? "" : (blog?.description as any),
    author: user?.username,
    createdAt: new Date().toISOString(),
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    if (isEditted) {
      await dispatch(
        updateBlogAsync({
          _id: formData._id,
          title: formData.title,
          description: formData.description,
          username: formData.author,
        })
      );
      dispatch(getBlogs());
    } else {
      await dispatch(
        addBlogAsync({
          title: formData.title,
          description: formData.description,
          author: formData.author,
        })
      );
    }

    if (onClose) {
      onClose();
    }

    dispatch(getBlogs());

    resetForm();
    navigate("/list");
  };

  const handleCancel = (e: any) => {
    if (onClose) {
      onClose();
    }

    navigate("/list");
  };

  const resetForm = () => {
    setFormData({
      _id: blogId,
      title: "",
      description: "",
      author: "",
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className="space-y-5 mt-5">
          <div className="p-5 pt-0">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  name="title"
                  defaultValue={blog?.title}
                  type="text"
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={handleInputChange}
                  defaultValue={blog?.description}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Write a few sentences about your blog.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 sm:gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            {isEditted ? (
              <button
                type="submit"
                aria-label="Update blog post"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? <LoadingSpinner /> : "Update"}
              </button>
            ) : (
              <button
                type="submit"
                aria-label="Save blog post"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? <LoadingSpinner /> : "Save"}
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
