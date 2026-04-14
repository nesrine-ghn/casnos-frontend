import MenuBar from "../components/MenuBar";
import DepartmentTable from "../components/DepartmentTable";

function DepartmentsPage() {
  return (
    <div className="admin-dashboard">
      <MenuBar />
      <div className="dashboard-content">
        <DepartmentTable />
      </div>
    </div>
  );
}

export default DepartmentsPage;