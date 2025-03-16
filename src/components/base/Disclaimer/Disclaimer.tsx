import { Box, Text, Textarea } from '@mantine/core';

type DisclaimerProps = {};

const Disclaimer = (props: DisclaimerProps) => {
  return (
    <Box>
      <h3>Disclaimer</h3>
      By using piggi-pal, you agree to the following:
      <br />
      <br />
      <h4>No Guarantees</h4>{' '}
      <Text fz="sm">
        Piggi-pal is provided "as is," and we don’t make any promises about it
        working perfectly or being free of errors. We’re not responsible for any
        issues that may come up while using the app.
      </Text>
      <br />
      <h4>Limit of Responsibility </h4>
      <Text fz="sm">
        We are not responsible for any damages, losses, or problems that may
        happen from using piggi-pal. This includes things like losing data, or
        if the app doesn’t work the way you expect it to.
      </Text>
      <br />
      <h4>Your Responsibility </h4>
      <Text fz="sm">
        You are responsible for how you use the app and any information you
        share. We’re not responsible for any loss or damage to your data or
        devices.
      </Text>
      <br />
      <h4>Changes or Shutdowns </h4>
      <Text fz="sm">
        We may change or stop the app at any time without notice. If this
        happens, we won’t be responsible for any issues that come up because of
        those changes.
      </Text>
      <br />
      <h4>Third-Party Links or Content </h4>
      <Text fz="sm">
        The app may link to other websites or services. We’re not responsible
        for what happens when you visit these sites, so use them at your own
        risk.
      </Text>
      <br />
      <h4>Privacy </h4>
      <Text fz="sm">
        Any personal information we collect is handled according to our Privacy
        Policy (link to it here). Please read the Privacy Policy to understand
        how we handle your data.
      </Text>
      <br />
      <h4>Indemnity </h4>
      <Text fz="sm">
        You agree to take responsibility for anything that comes up from your
        use of the app, including legal issues. This means you’ll protect us
        from any claims or problems that result from how you use piggi-pal.
      </Text>
      <br />
      <h4>Governing </h4>
      <Text fz="sm">
        Law The laws of Canada] apply to this disclaimer and your use of the
        app. Any legal matters related to the app will be handled in the courts
        of Canada.
      </Text>
      <br />
      <h4>Hobby project </h4>
      <Text fz="sm">
        This app is a hobby project and is ment for the app’s creators’ personal
        use.
      </Text>
    </Box>
  );
};

export default Disclaimer;
