import { Microphone } from "app/(speech)/src/app/components/Microphone.js";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Microphone />
    </main>
  );
}
