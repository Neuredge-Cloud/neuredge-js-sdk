import { completionTests } from './completion';
import { embeddingTests } from './embedding';
import { textTests } from './text';
import { imageTests } from './image';
import { vectorTests } from './vector';
import colors from 'colors';

async function runSuite(name: string, testFn: () => Promise<void>) {
  console.log(colors.blue.bold(`\n=== Running ${name} Test Suite ===`));
  try {
    await testFn();
    console.log(colors.green(`✓ ${name} suite completed`));
  } catch (error) {
    console.error(colors.red(`✗ ${name} suite failed:`), error);
  }
}

export async function runAllTests() {
  console.log(colors.bold('\nStarting all integration tests...\n'));

  await runSuite('Completion', completionTests);
  await runSuite('Embedding', embeddingTests);
  await runSuite('Text', textTests);
  await runSuite('Vector', vectorTests);
  await runSuite('Image', imageTests);
}

// Run tests
console.log(colors.bold('Integration Tests'));
runAllTests().catch(error => {
  console.error(colors.red('\nTest runner failed:'), error);
  process.exit(1);
});
