import styles from './test-components.module.css';
import PocketBase from 'pocketbase';

/* eslint-disable-next-line */
export interface TestComponentsProps {}


export function TestComponents(props: TestComponentsProps) {
  const PocketBaseClient = new PocketBase('http://127.0.0.1:8090');

  return (
    <div className={styles['container']}>
      <h1>Welcome to TestComponents!</h1>
    </div>
  );
}

export default TestComponents;
