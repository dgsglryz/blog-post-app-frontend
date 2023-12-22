import { Disclosure } from "@headlessui/react";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { isAuthorized, logoutUserAsync } from "../login/authSlice";
import { getUser, getUserAsync } from "../login/userSlice";
import { useEffect, useState } from "react";
import FormModal from "../../components/ui/Modal";
import BlogForm from "../blog/components/BlogForm";
import AppLogo from "../../components/icons/AppLogo";

const navigation = [{ name: "Dashboard", href: "/", current: true }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  children?: React.ReactNode;
};

export default function Dashboard(props: Props) {
  const { children } = props;
  const isLoggedin = useAppSelector(isAuthorized);
  const user = useAppSelector(getUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isOpened, setIsOpened] = useState<boolean>(false);

  useEffect(() => {
    if (isLoggedin) {
      dispatch(getUserAsync());
    }
  }, [dispatch, isLoggedin]);

  const handleCancelEdit = () => {
    setIsOpened(false);
  };

  const handleLogout = async () => {
    await dispatch(logoutUserAsync());
    navigate("/");
  };
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {() => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AppLogo />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    {!isLoggedin ? (
                      <div className="flex w-44 justify-between gap-3">
                        <Link
                          id="register"
                          to="/register"
                          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Sign up
                        </Link>
                        <Link
                          id="login"
                          to="/login"
                          className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Log in
                        </Link>
                      </div>
                    ) : (
                      <div className="ml-4 flex items-center md:ml-6">
                        {user && (
                          <p className="text-sm font-semibold leading-6 text-white">
                            Welcome, {user.name} {""} {user.surname}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Logout</span>
                          <ArrowLeftStartOnRectangleIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Dashboard
              </h1>
              {isLoggedin && (
                <div className="flex gap-2">
                  <Link
                    id="list"
                    to="/list"
                    className="flex w-30 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    View Blog
                  </Link>
                  <button
                    id="blog"
                    onClick={() => setIsOpened(true)}
                    className="flex w-30 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    + Add Blog
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            {children}
          </div>
          {isOpened && (
            <FormModal isOpened={isOpened} onClose={handleCancelEdit}>
              <BlogForm onClose={handleCancelEdit} />
            </FormModal>
          )}
        </main>
      </div>
    </>
  );
}
