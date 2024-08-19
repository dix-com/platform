import logo from "../../../src/assets/critter.png";
import classNames from "classnames";
import { useTheme } from "../../contexts/ThemeProvider";

const Logo = () => {
    const { theme } = useTheme();

    return (
        <img
            src={logo}
            className={classNames("logo", {
                dark: theme === "dim" || theme === "dark",
                light: theme === "light"
            })}
            alt="Logo"
        />
    )
}

export default Logo;