import logo from "../../assets/dix.png";
import classNames from "classnames";
import { useTheme } from "../../contexts/ThemeProvider";

const Loading = () => {
    const { theme } = useTheme();

    return (
        <div className="loading-route">
            <img
                src={logo}
                className={classNames("logo", {
                    dark: theme === "dim" || theme === "dark",
                    light: theme === "light"
                })}
                style={{ width: "100px" }}
                alt="X Icon"
            />
        </div>
    );
};

export default Loading;
