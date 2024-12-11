import CodeTransitionCompositionLoader from "./compositions/code-video-composition/composition-loader";
import { MyVideo } from "./compositions/poc/zoom-composition";

const RemotionRoot: React.FC = () => {
  return (
    <>
      <CodeTransitionCompositionLoader />
      <MyVideo />
    </>
  );
};

export default RemotionRoot;
