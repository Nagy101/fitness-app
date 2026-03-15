import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Dumbbell, ArrowRight } from "lucide-react";
import { getProxyImageUrl } from "@/lib/images";
import type { ClientService } from "@/types";

interface ServicesGridProps {
  services: ClientService[];
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service, index) => {
        const key = service.id || `service-${index}`;
        const isPopular = !!service.popular;
        const n =
          typeof service.price === "number"
            ? service.price
            : Number(service.price);
        const priceText = `${(isNaN(n) ? 0 : n).toFixed(2)} EGP`;

        const features = Array.isArray(service.features)
          ? service.features.slice(0, 3)
          : [];
        return (
          <Card
            key={key}
            className={`group relative overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] transition-all duration-300 transform hover:-translate-y-1 bg-white rounded-[1.75rem] flex flex-col h-full ${
              isPopular ? "ring-1 ring-primary/40" : ""
            }`}
          >
            {isPopular && (
              <div className="absolute top-3 left-3 z-20">
                <Badge
                  variant="default"
                  className="bg-primary text-primary-foreground"
                >
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="p-0 relative">
              <Link href={`/services/${service.id}`}>
                <div className="relative aspect-video overflow-hidden cursor-pointer">
                  {service.image ? (
                    <Image
                      src={
                        getProxyImageUrl(service.image) || "/placeholder.svg"
                      }
                      alt={service.title}
                      fill
                      unoptimized
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <Dumbbell className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute bottom-3 left-3">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-foreground"
                    >
                      {service.category}
                    </Badge>
                  </div>
                </div>
              </Link>
            </CardHeader>

            <CardHeader className="p-5 pb-2">
              <CardTitle
                className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 break-words leading-snug"
                title={service.title}
              >
                {service.title}
              </CardTitle>
              <CardDescription
                className="text-sm text-muted-foreground line-clamp-2 leading-relaxed break-words"
                title={service.description}
              >
                {service.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-5 pb-5 pt-0 flex flex-col flex-1">
              <div className="flex items-center text-sm text-muted-foreground mb-2.5">
                <Clock className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                <span className="truncate" title={service.duration}>
                  {service.duration}
                </span>
              </div>

              {features.length > 0 && (
                <ul className="space-y-1.5 mb-3">
                  {features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-4 mt-auto border-t border-border flex items-center justify-between gap-3">
                <div className="shrink-0">
                  <div className="text-xs text-muted-foreground">
                    Starting from
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {priceText}
                  </div>
                </div>

                <Button
                  asChild
                  size="sm"
                  className="h-10 px-4 text-sm font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-300 bg-primary hover:bg-primary/90 text-white"
                >
                  <Link href={`/services/${service.id}`}>
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
