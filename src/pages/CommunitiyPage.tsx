import CommunityCard from "@/components/layout/community/CommunityCard";
import RecordsPagination from "@/components/layout/records-list-page/RecordsPagination";
import SearchInputDeposition from "@/components/shared/SearchInputDeposition";
import { DEFAULT_COMMUNITY_SIZE, QUERY_PARAM_PAGE, QUERY_PARAM_SIZE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { useSearchParams } from "react-router";

const mockCommunities: {
  name: string
  description: string
  slug: string
}[] = [
  { name: "Elixir", slug: "elixir", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { name: "Ceitec", slug: "elixir", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { name: "Very Very long community name", slug: "elixir", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { name: "Very Very long community name", slug: "elixir", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { name: "Very Very long community name", slug: "elixir", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
]

const CommunityPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSize = searchParams.get(QUERY_PARAM_SIZE) || DEFAULT_COMMUNITY_SIZE;
  const currentPage = Number(searchParams.get(QUERY_PARAM_PAGE) || 1);

  const handlePageChange = (newPage: number) => {
    updateQueryParam(QUERY_PARAM_PAGE, String(newPage));
  };

  const updateQueryParam = (param: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(param, value);
    setSearchParams(newParams);
  };

  return (
    <div className="self-center flex min-h-svh max-w-5xl flex-col items-center justify-center gap-2 mt-16">
      <div className="space-y-8">
        <h1 className="font-heading mb-6">Communities</h1>
        <SearchInputDeposition
         secondaryBtnText="Create new"
         secondaryBtnLink="/community/new"
         secondaryBtnIcon={<PlusCircle />}
         searchUrl="/community"
        />

        <div className={cn("sapce-y-4")}
        > 
          {mockCommunities.map((item, index) => (
            <CommunityCard
              key={index}
              name={item.name}
              slug={item.slug}
              description={item.description}
            />
          ))}
        </div>

        <RecordsPagination 
          page={currentPage}
          recordsCount={30} // TODO: from fetched data
          recordsPerPage={Number(currentSize)}
          className="justify-end mb-8"
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default CommunityPage
