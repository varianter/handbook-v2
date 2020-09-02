import style from "./index.module.css";
import Layout from "src/layout";

export default function Index() {
  return (
    <Layout>
      <h1 className={style.title}>Hello, World!</h1>
    </Layout>
  );
}
