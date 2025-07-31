import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { SwiperNavigation } from "@/components/common/SwiperButton";
import Poster from "../common/Poster";
import "swiper/swiper-bundle.css";
import { useHeroPersona } from "@/hooks/queries/contents/useHeroPersona";
import { TMDB_IMAGE_BASE_URL } from "@/constants/contents";
import { PersonaRecommendation } from "@/types/Persona.types";
import LoginBlur from "../common/LoginBlur";

interface Props {
  accessToken: string;
  userId: number;
}

const HeroPersona = ({ accessToken, userId }: Props) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | undefined>(
    undefined,
  );
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const { data, isLoading, isError, isSuccess } = useHeroPersona(
    userId,
    accessToken,
    "all",
  );
  const recommendData = data?.recommendations;
  const persona = data?.main_persona ?? "나와 닮은 페르소나";

  if (isLoading) {
    return (
      <div className="py-20 text-center text-white">
        <p>추천 콘텐츠를 불러오는 중입니다...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="py-20 text-center text-red-600">
        <p>추천 콘텐츠를 불러오는 데 실패했습니다.</p>
      </div>
    );
  }
  if (isSuccess && (!recommendData || recommendData.length === 0)) {
    return (
      <div className="py-20 text-center text-gray-400">
        <p>😶 추천 콘텐츠가 아직 없습니다.</p>
      </div>
    );
  }

  const handleSwiperInit = (swiper: SwiperType) => {
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="md:px- m-auto w-full max-w-[1200px] px-3 sm:px-0">
      <div className="relative flex items-center">
        <img
          className="absolute left-0 w-24 translate-x-0 md:w-48"
          src="/images/persona/무비셜록-아기.svg"
          alt="아기 무비셜록"
        />
        <h3 className="gmarket ml-20 flex flex-wrap items-center gap-2 text-xl leading-snug sm:text-2xl md:ml-44 md:text-3xl">
          <span>
            <span className="text-popcorn-box">'{persona}'</span> 들이{" "}
          </span>
          많이 찾은 작품
        </h3>
      </div>
      <section>
        <div className="mb-4 flex justify-end">
          <SwiperNavigation
            swiper={swiperInstance}
            isBeginning={isBeginning}
            isEnd={isEnd}
          />
        </div>
        {!accessToken ? (
          <LoginBlur
            text="나의 영화 취향 캐릭터가 궁금하다면 ?"
            className="md:min-h-[400px]"
          />
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={15}
            onSwiper={handleSwiperInit}
            onSlideChange={handleSlideChange}
            breakpoints={{
              0: {
                slidesPerView: 2.5,
              },
              768: {
                slidesPerView: 3.5,
              },
              1024: {
                slidesPerView: 4.5,
              },
              1200: {
                slidesPerView: 5,
              },
            }}
          >
            {recommendData?.map(
              ({ contentId, title, poster_path }: PersonaRecommendation) => (
                <SwiperSlide key={contentId} className="flex justify-center">
                  <Poster
                    title={title}
                    posterUrl={`${TMDB_IMAGE_BASE_URL}${poster_path}`}
                    id={contentId}
                    likeState="NEUTRAL"
                    onLikeChange={() => {}}
                  />
                </SwiperSlide>
              ),
            )}
          </Swiper>
        )}
      </section>
    </div>
  );
};

export default HeroPersona;
