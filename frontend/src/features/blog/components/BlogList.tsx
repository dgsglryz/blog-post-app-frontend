import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  deleteBlogAsync,
  getBlogs,
  isBlogsPending,
  selectBlogs,
} from "../blogSlice";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import BlogForm from "./BlogForm";
import NoBlogMessage from "./NoBlogMessage";
import { format } from "date-fns";
import { isAuthorized } from "../../login/authSlice";
import { getUser } from "../../login/userSlice";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import FormModal from "../../../components/ui/Modal";

interface Blog {
  _id: string;
  title: string;
  description: string;
}

export default function BlogList() {
  const blogs = useAppSelector(selectBlogs);
  const dispatch = useAppDispatch();
  const isLoggedin = useAppSelector(isAuthorized);
  const user = useAppSelector(getUser);
  const isLoading = useAppSelector(isBlogsPending);

  const [loadingBlogs, setLoadingBlogs] = useState<string[]>([]);

  useEffect(() => {
    if (isLoggedin) {
      dispatch(getBlogs());
    }
  }, [dispatch, isLoggedin]);

  const [blog, setBlog] = useState<Blog>({
    _id: "",
    title: "",
    description: "",
  });
  const [isEddited, setIsEditted] = useState<boolean>(false);

  const handleEditBlogs = (_id: string, title: string, description: string) => {
    setIsEditted(true);
    setBlog({ _id, title, description });
  };

  const handleCancelEdit = () => {
    setIsEditted(false);
    setBlog({ _id: "", title: "", description: "" });
  };

  const handleDeleteBlog = async (blogId: string, author: string) => {
    try {
      setLoadingBlogs((prevLoadingBlogs) => [...prevLoadingBlogs, blogId]);

      await dispatch(deleteBlogAsync({ _id: blogId, username: author }));

      dispatch(getBlogs());
    } catch (error) {
      console.error("Error deleting blog:", error);
    } finally {
      setLoadingBlogs((prevLoadingBlogs) =>
        prevLoadingBlogs.filter((id) => id !== blogId)
      );
    }
  };

  if (!blogs.items.length) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center">
          <LoadingSpinner
            style={{ width: "8rem", height: "8rem", fill: "#4F46E5" }}
          />
          ;
        </div>
      );
    } else return <NoBlogMessage message="No blog posted yet!" />;
  }

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {blogs.items.map((article: any) => {
        const currentDate = new Date();
        const formattedDate = article?.createdAt
          ? format(new Date(article.createdAt), "MMMM d, yyyy, h:mm:ss a")
          : format(currentDate, "MMMM d, yyyy, h:mm:ss a");

        return (
          <li key={article._id} className="flex  gap-x-6 py-5 justify-between">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-3xl font-semibold leading-6 text-gray-900">
                  {article.title}
                </p>
                <p className="mt-6 text-base leading-5 text-gray-500">
                  {article.description}
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end justify-end">
              <div className="flex gap-2">
                {article.author === user.username && (
                  <>
                    <button
                      onClick={() =>
                        handleEditBlogs(
                          article._id,
                          article.title,
                          article.description
                        )
                      }
                    >
                      <PencilSquareIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      className=" flex gap-2 mt-1"
                      onClick={() =>
                        handleDeleteBlog(article._id, article.author)
                      }
                    >
                      {loadingBlogs.includes(article._id) ? (
                        <LoadingSpinner
                          style={{
                            width: "1rem",
                            height: "1rem",
                            fill: "#ff2d55",
                          }}
                        />
                      ) : (
                        <TrashIcon
                          className="h-5 w-5"
                          color="red"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </>
                )}
              </div>
              <p className="text-sm leading-6 text-gray-900">
                {article.author}
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Post date: {formattedDate}
              </p>
            </div>
          </li>
        );
      })}
      {isEddited && (
        <FormModal
          isOpened={isEddited}
          isEditted={isEddited}
          onClose={handleCancelEdit}
        >
          <BlogForm
            blog={blog}
            isEditted={isEddited}
            onClose={handleCancelEdit}
          />
        </FormModal>
      )}
    </ul>
  );
}
