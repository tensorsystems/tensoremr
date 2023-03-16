import Link from "next/link";
import classNames from "classnames";
import { useRouter } from "next/router";

interface Props {
  route: string;
  label: string;
  icon?: string;
  subItem?: boolean;
  disabled?: boolean;
  notifs?: number;
  status?: "success" | "pending_actions" | "warning" | "locked";
}

export default function NavItem(props: Props) {
  const router = useRouter();
  const { route, label, icon, subItem, disabled, notifs, status } = props;
  const selected = route === router.asPath;

  function BuildIcon() {
    if (subItem) {
      return <span className="material-symbols-outlined">{icon}</span>;
    } else {
      return (
        <div>
          {icon === undefined ? (
            <div>
              {status === "success" && (
                <div className={`material-symbols-outlined text-teal-800 check`}>check</div>
              )}
              {status === "success" && (
                <div
                  className={`material-symbols-outlined text-teal-800`}
                >warning</div>
              )}
              {status === "success" && (
                <div className={`material-symbols-outlined text-teal-800`}>lock</div>
              )}
              {status === "success" && (
                <div
                  className={`material-symbols-outlined text-teal-800`}
                >pending_actions</div>
              )}
            </div>
          ) : (
            <span className="material-symbols-outlined">{icon}</span>
          )}
        </div>
      );
    }
  }

  return (
    <Link href={disabled ? "#" : route}>
      <div
        className={classNames("px-3 py-[4px] rounded-md w-full", {
          "bg-teal-600": selected,
        })}
      >
        <div
          className={classNames(
            "font-sans w-full text-left focus:outline-none flex justify-between space-x-3 items-center",
            {
              "text-gray-50": selected,
              "text-gray-700": !selected,
            }
          )}
        >
          <div className="flex space-x-2 items-center">
            <BuildIcon />

            {subItem ? (
              <p>{label}</p>
            ) : (
              <p className="text-lg font-semibold">{label}</p>
            )}
          </div>

          {notifs !== undefined && notifs > 0 && (
            <div className="bg-teal-100 text-sm text-teal-600 h-6 w-6 rounded-lg flex items-center justify-center shadow-inner">
              {notifs}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
