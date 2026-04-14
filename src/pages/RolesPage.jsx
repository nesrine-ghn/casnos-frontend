import MenuBar from "../components/MenuBar";
import RolesTable from "../components/RolesTable";

function RolesPage() {
  return (
    <div className="admin-dashboard">
      <MenuBar />
      <div className="dashboard-content">
        <RolesTable />
      </div>
    </div>
  );
}

export default RolesPage;