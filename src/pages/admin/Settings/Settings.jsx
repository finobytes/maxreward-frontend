import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PointSettings from "./PointSettings";
import CPLevel from "./CPLevel";
import PageBreadcrumb from "../../../components/common/PageBreadcrumb";
const Settings = () => {
  return (
    <div>
      <PageBreadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Settings" }]}
      />
      <Tabs defaultValue="point" className="w-full">
        <TabsList>
          <TabsTrigger value="point">Point Settings</TabsTrigger>
          <TabsTrigger value="cp">CP Level Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="point">
          <PointSettings />
        </TabsContent>
        <TabsContent value="cp">
          <CPLevel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
