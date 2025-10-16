import { Spinner } from "./ui/spinner";

export default function Loading() {
  return (
    <div className="flex justify-center py-12">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
