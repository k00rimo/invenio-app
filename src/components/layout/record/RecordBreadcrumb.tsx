import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useMatches, Link, type UIMatch } from "react-router";
import { Fragment, type ReactNode } from "react";

type BreadcrumbValue = ReactNode | ((match: UIMatch) => ReactNode);
type BreadcrumbHandle = { breadcrumb: BreadcrumbValue };

const RecordBreadcrumbs = () => {
  const matches = useMatches().filter(
    (match): match is UIMatch<unknown, BreadcrumbHandle> => {
      return (
        typeof match.handle === "object" &&
        match.handle !== null &&
        "breadcrumb" in match.handle
      );
    }
  );

  return (
    <Breadcrumb className="p-6 pb-0">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/records-list">Records List</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {matches.map((match, idx) => {
          const label =
            typeof match.handle.breadcrumb === "function"
              ? match.handle.breadcrumb(match)
              : match.handle.breadcrumb;

          const isLast = idx === matches.length - 1;
          return (
            <Fragment key={match.pathname}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={match.pathname}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default RecordBreadcrumbs;
