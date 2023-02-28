import MyBreadcrumb from "../components/breadcrumb";
import StatCard from "../components/stat-card";
import WorkflowTable from '../components/workflow-table';

export function Index() {
  return (
    <div>
      <MyBreadcrumb crumbs={[{ href: "/", title: "Home", icon: "home" }]} />
      <div className="h-screen">
        <div className="md:flex md:space-x-4">
          <StatCard
            title={"Scheduled"}
            figure={0}
            onClick={() => {
              // handleStatClick('Scheduled');
            }}
          />
          <StatCard
            title={"Checked in"}
            figure={0}
            onClick={() => {
              //handleStatClick('Scheduled');
            }}
          />
          <StatCard
            title={"Checked out"}
            figure={0}
            onClick={() => {
              // handleStatClick('Scheduled');
            }}
          />
        </div>

        <div className="mt-6">
          <WorkflowTable onSelect={() => {}}/>
        </div>
      </div>
    </div>
  );
}

export default Index;
