import { useTranslation } from "react-i18next";

const WhyUs = () => {
    const { t } = useTranslation();

    return (
        <section className="container flex flex-wrap items-center justify-between gap-6 md:!py-17 py-8!">
            <div>
                <h2 className="text-[#505050] md:text-lg text-[10px] font-medium">
                    {t("whyUs.smallTitle")}
                </h2>

                <h2 className="md:w-[500px] text-[#121212] md:text-[40px] text-lg font-semibold leading-[150%]">
                    <span className="text-[#00567E]">
                        {t("whyUs.titleHighlight")}
                    </span>{" "}
                    {t("whyUs.titleRest")}
                </h2>

                <p className="md:w-[500px] text-[#505050] md:text-xl text-xs font-medium leading-[150%] !mt-4">
                    {t("whyUs.description")}
                </p>

                <div className="flex flex-wrap md:gap-8 gap-10 !mt-10">
                    <div className="flex flex-col">
                        <p className="text-[#00567E] rtl:md:text-[48px] ltr:md:text-4xl text-xl font-semibold leading-[150%]">
                            +5000
                        </p>
                        <p className="text-[#505050] rtl:md:text-[32px] ltr:text-2xl text-base font-medium">
                            {t("whyUs.stats.clients")}
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-[#00567E] rtl:md:text-[48px] ltr:md:text-4xl text-xl font-semibold leading-[150%]">
                            +40
                        </p>
                        <p className="text-[#505050] rtl:md:text-[32px] ltr:text-2xl text-base font-medium">
                            {t("whyUs.stats.destinations")}
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-[#00567E] rtl:md:text-[48px] ltr:md:text-4xl text-xl font-semibold leading-[150%]">
                            +900
                        </p>
                        <p className="text-[#505050] rtl:md:text-[32px] ltr:text-2xl text-base font-medium">
                            {t("whyUs.stats.trips")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative">
                <img src="/images/why_us.webp" alt="why us" />

                <div className="md:w-[206px] w-[123px] md:h-[94px] h-[50px] border border-[#A8DAF1] rounded-[20px] absolute top-10 md:left-96 bg-[#FEFEFE] flex items-center justify-center gap-1">
                    <img
                        src="/images/star.gif"
                        alt="star"
                        className="md:w-14 w-6 md:h-14 h-6"
                    />
                    <div>
                        <h2 className="text-[#00567E] md:text-[32px] text-base font-semibold">
                            +2000
                        </h2>
                        <p className="text-[#121212] md:text-lg text-[10px] font-medium">
                            {t("whyUs.badges.recommended")}
                        </p>
                    </div>
                </div>

                <div className="md:w-[206px] w-[123px] md:h-[94px] h-[50px] border border-[#A8DAF1] rounded-[20px] absolute -bottom-10 md:right-96 right-56 bg-[#FEFEFE] flex items-center justify-center gap-1">
                    <img
                        src="/images/success.gif"
                        alt="success"
                        className="md:w-14 w-6 md:h-14 h-6"
                    />
                    <div>
                        <h2 className="text-[#00567E] md:text-[32px] text-base font-semibold">
                            +2000
                        </h2>
                        <p className="text-[#121212] md:text-lg text-[10px] font-medium">
                            {t("whyUs.badges.happyClients")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyUs;
