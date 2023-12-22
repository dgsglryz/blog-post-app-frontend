import { Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

type Props = {
  isOpened: boolean;
  isEditted?: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};
export default function FormModal({
  isOpened,
  isEditted,
  onClose,
  children,
}: Props) {
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpened && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [isOpened]);

  return (
    <Transition.Root show={isOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <Dialog.Title
                  as="h3"
                  className="text-2xl leading-6 text-gray-900 pt-4 pl-4 pr-4"
                >
                  {isEditted ? "Edit Blog Post" : "Add Blog Post"}
                  <p className="text-sm leading-6 text-gray-600 mt-2">
                    {!isEditted
                      ? "Add a blog post, your blog post will be seen by other user as well"
                      : "Edit a blog post, your blog post will be seen by other user as well"}
                  </p>
                </Dialog.Title>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
