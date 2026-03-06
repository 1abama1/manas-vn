import { Button, ButtonProps, ButtonTypeMap } from "@mui/joy";
import { motion, Variants } from "motion/react";

interface MenuButtonProps
    extends ButtonProps<
        ButtonTypeMap["defaultComponent"],
        {
            component?: React.ElementType;
        }
    > {
    transitionDelay?: number;
}

export default function MenuButton(props: MenuButtonProps) {
    const { sx, transitionDelay, ...rest } = props;
    const itemVariants: Variants = {
        open: {
            opacity: 1,
            x: 0,
            transition: { type: "spring", stiffness: 300, damping: 24, delay: transitionDelay },
        },
        closed: { opacity: 0, x: -50, transition: { duration: 0.2 } },
    };

    return (
        <Button
            size='lg'
            variant='outlined'
            color='neutral'
            sx={{
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem", lg: "1.5rem" },
                color: "rgba(255, 255, 255, 0.9)",
                borderColor: "rgba(255, 255, 255, 0.2)",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                transition: "all 0.3s ease",
                '&:hover': {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    color: "#ffffff",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.8)",
                },
                ...sx,
            }}
            component={motion.div}
            variants={itemVariants}
            {...rest}
        />
    );
}
