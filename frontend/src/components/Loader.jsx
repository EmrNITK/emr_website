export default function Loader() {
  return (
    <div style={styles.container}>
      <h2>Loading...</h2>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
  },
};
