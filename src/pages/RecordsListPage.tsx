import RecordsListFilter from "@/components/forms/filters/RecordsListFilter";
import RecordCard from "@/components/layout/records-list-page/RecordCard";
import RecordsPagination from "@/components/layout/records-list-page/RecordsPagination";
import ScrollToTop from "@/components/shared/ScrollToTop";
import SearchInputDeposition from "@/components/shared/SearchInputDeposition";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RecordsListPage = () => {    

  return (
    <div className="min-h-svh flex items-start justify-center gap-8 pt-10 mb-8 bg-white">
      {/* filters */}
      <RecordsListFilter />

      <div className="flex flex-col gap-8">
        <SearchInputDeposition />
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <p>Results</p>  
              <span className="font-button-sm">123</span>
            </div>
            <div className="flex gap-5">
              <div className="flex items-center gap-2.5">
                <label>Sort by</label>
                <Select defaultValue="date-published-asc">
                  <SelectTrigger variant="input" value="date-published-asc" className="w-[225px] h-10">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-published-asc">Date published (asc)</SelectItem>
                    <SelectItem value="date-published-desc">Date published (desc)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2.5">
                <label>Result per page</label>
                <Select defaultValue="10">
                  <SelectTrigger variant="input" value="10" className="w-[85px] h-10">
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
          activeIndex={1}
          recordsCount={80}
          recrodsPerPage={10}
          className="justify-end"
        />
      </div>
      <ScrollToTop />
    </div>
  );
}

export default RecordsListPage
