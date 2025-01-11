// import CodeTransitionCompositionLoader from "./compositions/code-video-composition/composition-loader";
import { ZoomCompositionLoader } from "@/app/zoom/zoom-composition-better/loader";
import { MyVideo as Zoom } from "./compositions/poc/zoom-composition";

const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* <CodeTransitionCompositionLoader /> */}
      {/* <Zoom /> */}
      <ZoomCompositionLoader />
    </>
  );
};

export default RemotionRoot;
