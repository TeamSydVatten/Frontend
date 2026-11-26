import { ThemeToggleButton } from "@/components/TailAdminComponents/common/ThemeToggleButton";
import { useSidebar } from "@/context/SidebarContext";
import { MenuIcon } from "@/icons";
import { useTranslation } from "react-i18next";

/**
 * Header för mobil och surfplatta (under xl / 1280px).
 * Sidomenyn är dold där, så här finns knappen som öppnar den
 * och dark mode-knappen. På desktop ligger båda i sidomenyn.
 */
const AppHeader: React.FC = () => {
  const { t } = useTranslation();
  const { toggleMobileSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3 xl:hidden dark:border-gray-800 dark:bg-gray-900">
      <button
        type="button"
        onClick={toggleMobileSidebar}
        aria-label={t("header.toggleSidebar")}
        className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <MenuIcon className="size-5" />
      </button>

      <ThemeToggleButton />
    </header>
  );
};

export default AppHeader;
