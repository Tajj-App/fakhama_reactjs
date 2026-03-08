import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  // Variants for animation
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="md:!py-12 py-8 bg-[#F7FAFC]">
      <div className="relative container flex flex-wrap items-center gap-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 z-10"
          style={{ backgroundImage: "url('/images/world.png')" }}
        ></div>

        {/* Left content */}
        <motion.div
          className="flex-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-[#121212] md:text-[48px] text-2xl font-semibold leading-[150%]"
            variants={fadeInUp}
          >
            <span className="text-[#00567E]">{t("hero.titleStart")} </span>
            {t("hero.titleMiddle")} <br />
            <span className="text-[#00567E]">{t("hero.titleEnd")}</span>
          </motion.h2>

          <motion.p
            className="text-[#505050] md:text-xl text-sm font-medium mt-6"
            variants={fadeInUp}
          >
            {t("hero.description")}
          </motion.p>

          <motion.a
            href="#destinations"
            className=" flex items-center justify-center md:w-[306px] w-full md:h-14 h-12 bg-[#0478AF] rounded-[50px] !mt-6 text-[#FEFEFE] text-lg font-semibold relative z-40"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("hero.button")}
          </motion.a>

          <motion.div
            className="md:block hidden absolute rtl:right-76 ltr:left-76 rtl:top-[450px] ltr:top-[500px]"
            variants={fadeInUp}
          >
            <img
              src="/images/arrow.svg"
              alt="arrow"
              className="transform ltr:scale-x-[-1]"
            />
          </motion.div>
        </motion.div>

        {/* Right images */}
        <motion.div
          className="flex md:gap-8 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.img
            src="/images/hero1.jpg"
            alt="hero image"
            className="md:w-[276px] w-[163px] md:h-[633px] h-[374px] rounded-[50px] object-cover"
            variants={fadeInUp}
          />
          <div className="flex flex-col md:gap-8 gap-4">
            <motion.img
              src="/images/hero2.jpg"
              alt="hero image"
              className="md:w-[276px] w-[163px] md:h-[284px] h-[168px] rounded-[50px] object-cover"
              variants={fadeInUp}
            />
            <motion.img
              src="/images/hero3.jpg"
              alt="hero image"
              className="md:w-[276px] w-[163px] md:h-[284px] h-[168px] rounded-[50px] object-cover"
              variants={fadeInUp}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
