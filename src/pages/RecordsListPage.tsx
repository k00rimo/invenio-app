import RecordsListFilter from "@/components/forms/filters/RecordsListFilter";
import RecordCard from "@/components/layout/records-list-page/RecordCard";
import RecordsPagination from "@/components/layout/records-list-page/RecordsPagination";
import ScrollToTop from "@/components/shared/ScrollToTop";
import SearchInputDeposition from "@/components/shared/SearchInputDeposition";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams } from "react-router";

const QUERY_PARAM_SORT = 'sort';
const QUERY_PARAM_SIZE = 'size';
const QUERY_PARAM_PAGE = 'page';

const DEFAULT_SORT = 'bestmatch';
const DEFAULT_SIZE = '10';

const RecordsListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const currentSort = searchParams.get(QUERY_PARAM_SORT) || DEFAULT_SORT;
  const currentSize = searchParams.get(QUERY_PARAM_SIZE) || DEFAULT_SIZE;
  const currentPage = Number(searchParams.get(QUERY_PARAM_PAGE) || 1);
  
  // TODO: Use query, currentSort, and currentSize to fetch filtered records

  console.log(query)
  console.log("page", currentPage)

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
    <div className="min-h-svh flex items-start justify-center gap-8 pt-10 mb-8 bg-white">
      
      {/* filters */}
      <RecordsListFilter />

      <div className="flex flex-col gap-8 relative">
        
        <div className="hidden lg:block absolute left-full ml-8 w-10 h-full pointer-events-none">
          <div className="sticky top-[calc(100vh-8rem)] pointer-events-auto">
            <ScrollToTop />
          </div>
        </div>

        <SearchInputDeposition />
        
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2.5">
              <p>Results</p>  
              <span className="font-button-sm">123</span>
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
            <RecordCard recordLink={"/records/hello-world"} title={"Title of the record"} access={"open"} language={"English"} dateOfAcquisition={new Date("8.10.2025")} authors={["Matej", "Adam", "Filip"]} tags={["Protein", "Structure", "Molecule"]} affiliation={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur"} imageUrl={"random"} />
            <RecordCard recordLink={"/records/hello-world"} title={"Title of the record"} access={"restricted"} language={"English"} dateOfAcquisition={new Date("8.10.2025")} authors={["Matej", "Adam", "Filip"]} tags={["Protein", "Structure", "Molecule"]} affiliation={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur"} imageUrl={"random"} />
            <RecordCard recordLink={"/records/hello-world"} title={"Title of the record"} access={"closed"} language={"English"} dateOfAcquisition={new Date("8.10.2025")} authors={["Matej", "Adam", "Filip"]} tags={["Protein", "Structure", "Molecule"]} affiliation={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur"} imageUrl={"random"} />
            <RecordCard recordLink={"/records/hello-world"} title={"Title of the record"} access={"closed"} language={"English"} dateOfAcquisition={new Date("8.10.2025")} authors={["Matej", "Adam", "Filip"]} tags={["Protein", "Structure", "Molecule"]} affiliation={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur"} imageUrl={"random"} />
            <RecordCard recordLink={"/records/hello-world"} title={"Title of the record"} access={"closed"} language={"English"} dateOfAcquisition={new Date("8.10.2025")} authors={["Matej", "Adam", "Filip"]} tags={["Protein", "Structure", "Molecule"]} affiliation={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur"} imageUrl={"random"} />
            <RecordCard recordLink={"/records/hello-world"} title={"Title of the record"} access={"closed"} language={"English"} dateOfAcquisition={new Date("8.10.2025")} authors={["Matej", "Adam", "Filip"]} tags={["Protein", "Structure", "Molecule"]} affiliation={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur"} imageUrl={"random"} />
            <RecordCard recordLink={"/records/hello-world"} title={"Title of the record"} access={"closed"} language={"English"} dateOfAcquisition={new Date("8.10.2025")} authors={["Matej", "Adam", "Filip"]} tags={["Protein", "Structure", "Molecule"]} affiliation={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur"} imageUrl={"random"} />
          </div>
        </div>
        
        <RecordsPagination 
          page={currentPage}
          recordsCount={80} // TODO: from fetched data
          recordsPerPage={Number(currentSize)}
          className="justify-end"
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default RecordsListPage
