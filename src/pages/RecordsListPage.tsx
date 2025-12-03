import { API_URL } from "@/api/client";
import RecordsListFilter from "@/components/forms/filters/RecordsListFilter";
import ActiveFilters from "@/components/layout/recordsListPage/ActiveFilters";
import RecordCard from "@/components/layout/recordsListPage/RecordCard";
import RecordsPagination from "@/components/layout/recordsListPage/RecordsPagination";
import LoadingComponent from "@/components/shared/LoadingComponent";
import ScrollToTop from "@/components/shared/ScrollToTop";
import SearchInputDeposition from "@/components/shared/SearchInputDeposition";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";
import { DEFAULT_SIZE, DEFAULT_SORT, QUERY_PARAM_PAGE, QUERY_PARAM_SIZE, QUERY_PARAM_SORT } from "@/lib/constants/constants";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";


const RecordsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const topRef = useRef<HTMLDivElement>(null);
  
  const query = searchParams.get('q') || '';  // TODO: use query
  const currentSort = searchParams.get(QUERY_PARAM_SORT) || DEFAULT_SORT;
  const currentSize = searchParams.get(QUERY_PARAM_SIZE) || DEFAULT_SIZE;
  const currentPage = Number(searchParams.get(QUERY_PARAM_PAGE) || 1);

  const { 
    data, 
    isLoading, 
    isError, 
  } = useProjects({
    search: query,
    page: currentPage,
    limit: Number(currentSize),
    // search: debouncedSearch,
  });

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage, currentSize, currentSort, query]);

  const updateQueryParam = (param: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(param, value);
    setSearchParams(newParams);
  };

  const handleSortChange = (newSortValue: string) => {
    updateQueryParam(QUERY_PARAM_SORT, newSortValue);
  };

  const handleSizeChange = (newSizeValue: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(QUERY_PARAM_SIZE, newSizeValue);
    newParams.set(QUERY_PARAM_PAGE, "1"); 
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParam(QUERY_PARAM_PAGE, String(newPage));
  };

  return (
    <div ref={topRef} className="min-h-svh max-w-7xl w-full mx-auto flex items-start justify-center gap-8 pt-10 mb-8 bg-white">
      
      {/* filters */}
      <RecordsListFilter />

      <div className="flex flex-col gap-6 relative w-5xl">
        
        <div className="hidden lg:block absolute left-full ml-8 w-10 h-full pointer-events-none">
          <div className="sticky top-[calc(100vh-8rem)] pointer-events-auto">
            <ScrollToTop />
          </div>
        </div>

        <SearchInputDeposition />

        <ActiveFilters />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2.5">
              <p>Results</p>  
              <span className="font-button-sm">{data?.filteredCount}</span>
            </div>
            <div className="flex gap-5">
              <div className="flex items-center gap-2.5">
                <label htmlFor="sort-by">Sort by</label>
                <Select value={currentSort} onValueChange={handleSortChange}>
                  <SelectTrigger 
                    id="sort-by"
                    variant="input" 
                    className="w-[225px] h-10"
                  >
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bestmatch">Bestmatch</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="updated-desc">Updated (desc)</SelectItem>
                    <SelectItem value="updated-asc">Updated (asc)</SelectItem>
                    <SelectItem value="version">Version</SelectItem>
                    <SelectItem value="mostviewed">Mostviewed</SelectItem>
                    <SelectItem value="mostdownloaded">Mostdownloaded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2.5">
                <label htmlFor="results-per-page">Result per page</label>
                <Select value={currentSize} onValueChange={handleSizeChange}>
                  <SelectTrigger 
                    id="results-per-page"
                    variant="input" 
                    className="w-[85px] h-10"
                  >
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent className="w-[85px]">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="40">40</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-5 mb-8">
            {isLoading && <LoadingComponent />}
            {isError && "Oops..."}
            {!isLoading && !isError && data && data.projects.map((record, index) => (
              <RecordCard
                key={index}
                recordLink={`/records/${record.accession}/overview`}
                title={record.accession}
                access={"open"}  // TODO: when api works, replace with actual access
                creationDate={record.creationDate}
                authors={record.metadata.AUTHORS}
                tags={["Protein", "Structure", "Molecule"]}
                description={record.metadata.DESCRIPTION}
                imageUrl={`${API_URL}/projects/${record.accession}/files/screenshot.jpg`}
              />
            ))}
          </div>
        </div>
        
        <RecordsPagination 
          page={currentPage}
          recordsCount={data?.filteredCount !== undefined ? data.filteredCount : 0} // TODO: from fetched data
          recordsPerPage={Number(currentSize)}
          className="justify-end"
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default RecordsListPage
