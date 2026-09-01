import { SimplePage } from "@/components/simple-page";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <SimplePage eyebrow="Privacy" title="Privacy policy draft." intro="This draft must be reviewed before launch.">
      <div className="card">
        <p>
          Customer data and device data should only be accessed for diagnosis, repair,
          quote generation, communication and legal record keeping. Passcodes and files
          must not be accessed beyond the approved repair purpose.
        </p>
      </div>
    </SimplePage>
  );
}
