import CommunityCard from "@/components/layout/community/CommunityCard";
import RecordsPagination from "@/components/layout/recordsListPage/RecordsPagination";
import LoadingComponent from "@/components/shared/LoadingComponent";
import SearchInputDeposition from "@/components/shared/SearchInputDeposition";
import { useCommunities } from "@/hooks";
import { DEFAULT_COMMUNITY_SIZE, QUERY_PARAM_PAGE, QUERY_PARAM_SIZE } from "@/lib/constants/constants";
import { cn } from "@/lib/utils";
import type { CommunityQueryParams } from "@/types/mdpositTypes";
import { PlusCircle } from "lucide-react";
import { useSearchParams } from "react-router";

const CommunityPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSize = searchParams.get(QUERY_PARAM_SIZE) || DEFAULT_COMMUNITY_SIZE;
  const currentPage = Number(searchParams.get(QUERY_PARAM_PAGE) || 1);
  const query = searchParams.get('q') || ''

  const params: CommunityQueryParams = {
    q: query || undefined,
    page: currentPage,
    size: currentSize,
    sort: "newest",
  };

  const { data, isLoading, isError, error } = useCommunities(params);

  if (isLoading) {
    return <LoadingComponent />
  }

  if (isError) {
    return <div>Error fetching communities: {error?.message}</div>;
  }

  const communities = data?.hits.hits ?? [];
  const communitiesCount = data?.hits.total ?? 0;

  const handlePageChange = (newPage: number) => {
    updateQueryParam(QUERY_PARAM_PAGE, String(newPage));
  };

  const updateQueryParam = (param: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(param, value);
    setSearchParams(newParams);
  };

  return (
    <div className="self-center flex min-h-svh w-4xl flex-col items-center justify-start gap-2 mt-16">
      <div className="w-full space-y-8">
        <h1 className="font-heading mb-6">Communities</h1>
        <SearchInputDeposition
         secondaryBtnText="Create new"
         secondaryBtnLink="/community/new"
         secondaryBtnIcon={<PlusCircle />}
         searchUrl="/community"
        />

        <div className={cn("sapce-y-4")}
        > 
          {communities.map((item, index) => (
            <CommunityCard
              key={index}
              name={item.metadata.title}
              slug={item.slug}
              description={item.metadata.description}
            />
          ))}
        </div>

        <RecordsPagination 
          page={currentPage}
          recordsCount={communitiesCount} // TODO: from fetched data
          recordsPerPage={Number(currentSize)}
          className="justify-end mb-8"
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default CommunityPage
