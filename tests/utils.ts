import colors from 'colors';

export async function logTest(name: string, testFn: () => Promise<boolean>) {
  console.log(colors.blue(`\nStarting test: ${name}`));
  try {
    console.log(colors.gray('Running test...'));
    const passed = await testFn();
    if (passed) {
      console.log(colors.green(`✓ ${name} - Passed`));
    } else {
      console.log(colors.red(`✗ ${name} - Failed (no error thrown)`));
      throw new Error('Test assertion failed');
    }
  } catch (error) {
    console.error(colors.red(`✗ ${name} - Error:`));
    const errorMessage = error instanceof Error 
      ? error.stack || error.message 
      : String(error);
    console.error(colors.red(errorMessage));
    throw error;
  }
}

export async function log(...params:any[]) {
  return console.log(params)
}
