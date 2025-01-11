// import CodeTransitionCompositionLoader from "./compositions/code-video-composition/composition-loader";
import { MyVideo as Zoom } from "./compositions/poc/zoom-composition";
import { ZoomCompositionLoader } from "./compositions/poc/zoom-composition-better/loader";

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
