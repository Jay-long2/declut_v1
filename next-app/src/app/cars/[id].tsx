import { useRouter } from "next/router";

const Car = () => {
  /**VARIABLES */
  const router = useRouter();
  const { id } = router.query;

  /**FUNCTIONS */

  /**COMPONENT */
  return (
    <div>
      <div>This is a {id}</div>
    </div>
  );
};

export default Car;
