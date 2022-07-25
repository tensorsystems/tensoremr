import styles from './test-components.module.css';

/* eslint-disable-next-line */
export interface TestComponentsProps {}

export function TestComponents(props: TestComponentsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to TestComponents!</h1>
    </div>
  );
}

export default TestComponents;
