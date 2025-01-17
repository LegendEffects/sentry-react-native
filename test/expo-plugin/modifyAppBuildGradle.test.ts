import { WarningAggregator } from 'expo/config-plugins';

import { modifyAppBuildGradle } from '../../plugin/src/withSentryAndroid';

jest.mock('expo/config-plugins');

const buildGradleWithSentry = `
apply from: new File(["node", "--print", "require('path').dirname(require.resolve('@sentry/react-native/package.json'))"].execute().text.trim(), "sentry.gradle")

android {
}
`;

const buildGradleWithOutSentry = `
android {
}
`;

const monoRepoBuildGradleWithSentry = `
apply from: new File(["node", "--print", "require('path').dirname(require.resolve('@sentry/react-native/package.json'))"].execute().text.trim(), "sentry.gradle")

android {
}
`;

const monoRepoBuildGradleWithOutSentry = `
android {
}
`;

const buildGradleWithOutReactGradleScript = `
`;

describe('Configures Android native project correctly', () => {
  it("Non monorepo: Doesn't modify app/build.gradle if Sentry's already configured", () => {
    expect(modifyAppBuildGradle(buildGradleWithSentry)).toStrictEqual(buildGradleWithSentry);
  });

  it('Non monorepo: Adds sentry.gradle script if not present already', () => {
    expect(modifyAppBuildGradle(buildGradleWithOutSentry)).toStrictEqual(buildGradleWithSentry);
  });

  it("Monorepo: Doesn't modify app/build.gradle if Sentry's already configured", () => {
    expect(modifyAppBuildGradle(monoRepoBuildGradleWithSentry)).toStrictEqual(monoRepoBuildGradleWithSentry);
  });

  it('Monorepo: Adds sentry.gradle script if not present already', () => {
    expect(modifyAppBuildGradle(monoRepoBuildGradleWithOutSentry)).toStrictEqual(monoRepoBuildGradleWithSentry);
  });

  it('Warns to file a bug report if no react.gradle is found', () => {
    (WarningAggregator.addWarningAndroid as jest.Mock).mockImplementationOnce(jest.fn());
    modifyAppBuildGradle(buildGradleWithOutReactGradleScript);
    expect(WarningAggregator.addWarningAndroid).toHaveBeenCalled();
  });
});
