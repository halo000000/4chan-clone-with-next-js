
import Board from '@/components/Board';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12">
      <h1 className="text-3xl font-bold mb-6 text-center">AnonTalk</h1>
      <Board />
    </main>
  );
}
