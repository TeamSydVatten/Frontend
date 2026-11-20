import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import ComponentCard from "@/components/TailAdminComponents/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { navItems } from "@/layout/navItems";
import PageBreadcrumb from "@/components/TailAdminComponents/common/PageBreadCrumb";

// Snabblänkarna byggs från samma lista som sidomenyn (src/layout/navItems.tsx),
// så nya sidor i menyn dyker upp här automatiskt.
export default function Startsida() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const label = (key: string | undefined, fallback: string) =>
    key ? t(`sidebar.items.${key}`, { defaultValue: fallback }) : fallback;

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Startsida"/>
      {navItems
        .filter((group) => group.subItems?.length)
        .map((group) => (
          <ComponentCard key={group.key ?? group.name} title={label(group.key, group.name)}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
              {group.subItems!.map((item) => (
                <div key={item.path}>
                  <Button
                    size="sm"
                    variant="outline"
                    startIcon={<span className="text-lg">{group.icon}</span>}
                    onClick={() => navigate(item.path)}
                  >
                    {label(item.key, item.name)}
                  </Button>
                </div>
              ))}
            </div>
          </ComponentCard>
        ))}
    </div>
  );
}
