<<<<<<< Updated upstream
import CodeTransitionCompositionLoader from "./compositions/code-video-composition/composition-loader";
import { MyVideo } from "./compositions/poc/zoom-composition";
=======
// import CodeTransitionCompositionLoader from "./compositions/code-video-composition/composition-loader";
import { ZoomCompositionLoader } from "@/app/zoom/zoom-composition-better/loader";
import { MyVideo as Zoom } from "./compositions/poc/zoom-composition";
import CodeTransitionCompositionLoader from "./compositions/code-video-composition/composition-loader";
>>>>>>> Stashed changes

const RemotionRoot: React.FC = () => {
  return (
    <>
      <CodeTransitionCompositionLoader />
<<<<<<< Updated upstream
      <MyVideo />
=======
      {/* <Zoom /> */}
      <ZoomCompositionLoader />
>>>>>>> Stashed changes
    </>
  );
};

export default RemotionRoot;
