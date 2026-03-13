import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function IntegrationsLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-36" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>

      <section className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-start gap-4">
                <Skeleton className="size-10 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-start gap-4">
                <Skeleton className="size-10 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-8 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
