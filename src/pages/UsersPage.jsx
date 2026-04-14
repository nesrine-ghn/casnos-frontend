import MenuBar from "../components/MenuBar";
import UserTable from "../components/UserTable";

function UsersPage() {
  return (
    <div className="admin-dashboard">
      <MenuBar />
      <div className="dashboard-content">
        <UserTable onRefresh={() => {}} />
      </div>
    </div>
  );
}

export default UsersPage;