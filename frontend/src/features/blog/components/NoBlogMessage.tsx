type Props = {
  message: string;
};

export default function NoBlogMessage(props: Props) {
  const { message } = props;
  return (
    <div className="flex items-center justify-center">
      <p className="text-5xl mt-60">{message}</p>
    </div>
  );
}
