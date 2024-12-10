import { OffthreadVideo } from "remotion";

const CompositionVideo = ({
  src,
  slideDuration,
}: {
  src: string;
  slideDuration: number;
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center border-2 backdrop-blur-sm">
      <OffthreadVideo
        src={src}
        className="h-auto w-[75%] rounded-2xl shadow-2xl"
        // delayRenderRetries={3}
        // delayRenderTimeoutInMilliseconds={1000 * 60 * 12}
      />
    </div>
  );
};

export default CompositionVideo;
