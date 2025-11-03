import { Eyes, ClassicRunner, Target, Configuration, BatchInfo } from '@applitools/eyes-playwright';

export class VisualHelper {
  constructor(page) {
    this.page = page;
    this.runner = new ClassicRunner();
    this.eyes = new Eyes(this.runner);

    // ✅ Ensure API key is set
    this.eyes.setApiKey(process.env.APPLITOOLS_API_KEY || 'nNhXo4NMDZObtTQcPQ7nz3TYydNFmbUMu8R0103g9NM5Y110');

    // ✅ Basic configuration
    const config = new Configuration();
    config.setAppName('Appla-x App');
    config.setBatch(new BatchInfo('Appla-x Visual Batch'));
    this.eyes.setConfiguration(config);
  }

  async openTest(testName) {
    const config = this.eyes.getConfiguration();
    config.setTestName(testName);
    this.eyes.setConfiguration(config);

    // ✅ Open Eyes session
    await this.eyes.open(this.page);
  }

  async checkWindow(name) {
    await this.eyes.check(name, Target.window());
  }

  async closeEyes() {
    try {
      // ✅ Properly close the test and get results
      const results = await this.eyes.close(false);
      console.log('✅ Applitools results:', results.getUrl());
    } catch (error) {
      console.error('⚠️ Error closing Applitools Eyes:', error);
    } finally {
      // ✅ Ensures session isn’t left “Aborted”
      await this.eyes.abortIfNotClosed();
    }
  }
}
