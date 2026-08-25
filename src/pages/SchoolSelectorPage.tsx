import {
  ArrowRight,
  GraduationCap,
  Languages,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export function SchoolSelectorPage() {
  return (
    <>
      <main className="paragon-entry relative min-h-screen overflow-hidden bg-[#071b34]">
        {/* =========================================================
            TOP BRAND
        ========================================================== */}

        <header
          className="
            entry-header
            absolute
            inset-x-0
            top-0
            z-50
            flex
            items-center
            justify-between
            px-5
            py-5
            sm:px-8
            lg:px-12
            xl:px-16
          "
        >
          {/* <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-white/30 sm:w-12" />

            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[.28em]
                text-white/70
                sm:text-[10px]
              "
            >
              Paragon Group of Schools
            </p>
          </div> */}

          <div
            className="
              hidden
              items-center
              gap-2
              rounded-full
              border
              border-white/15
              bg-white/[.07]
              px-4
              py-2
              text-[9px]
              font-bold
              uppercase
              tracking-[.18em]
              text-white/70
              backdrop-blur-xl
              sm:flex
            "
          >
            <span className="size-1.5 rounded-full bg-[#ffffff]" />
            Mohali, Punjab
          </div>
        </header>

        {/* =========================================================
            DESKTOP — SPLIT ENTRANCE
        ========================================================== */}

        <section
          className="
          
            entry-split
            hidden
            min-h-screen
            lg:flex
          "
          aria-label="Choose your school"
        >
          {/* =====================================================
              SENIOR SCHOOL
          ====================================================== */}

          <Link
            to="/school"
            className="
              entry-panel
              entry-senior
              group
              relative
              flex
              min-h-screen
              w-1/2
              overflow-hidden
              bg-[#08294a]
              text-white
              transition-[width]
              duration-700
              ease-[cubic-bezier(.22,1,.36,1)]
              hover:w-[56%]
            "
          >
            {/* background */}

            <div className="absolute inset-0">
              <img
                src="/images/paragonmohali_bg.jpg"
                alt=""
                aria-hidden="true"
                className="
                  size-full
                  scale-[1.03]
                  object-cover
                  object-center
                  transition
                  duration-[1400ms]
                  ease-out
                  group-hover:scale-[1.08]
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-[linear-gradient(90deg,rgba(4,25,49,.94)_0%,rgba(5,37,68,.79)_42%,rgba(5,35,64,.44)_100%)]
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-[linear-gradient(0deg,rgba(3,20,39,.93)_0%,transparent_48%,rgba(3,20,39,.28)_100%)]
                "
              />
            </div>

            {/* architectural lines */}

            <div
              aria-hidden="true"
              className="
                absolute
                -left-[160px]
                top-[14%]
                size-[480px]
                rounded-full
                border
                border-white/[.08]
              "
            />

            <div
              aria-hidden="true"
              className="
                absolute
                -left-[90px]
                top-[20%]
                size-[340px]
                rounded-full
                border
                border-[#e4b34d]/20
              "
            />

            <div
              aria-hidden="true"
              className="
                absolute
                left-[8%]
                top-[19%]
                h-[1px]
                w-[90px]
                bg-[#e4b34d]/60
              "
            />

            {/* school number */}

            <span
              aria-hidden="true"
              className="
                absolute
                right-[7%]
                top-[14%]
                font-serif
                text-[130px]
                leading-none
                text-white/[.035]
                transition
                duration-700
                group-hover:text-white/[.06]
              "
            >
              01
            </span>

            {/* logo */}

            <div
              className="
                absolute
                left-12
                top-[13%]
                z-20
                xl:left-16
              "
            >
              <img
                src="/images/paragon-school-logo.webp"
                alt="Paragon Senior Secondary School"
                className="
                  h-[72px]
                  w-auto
                  object-contain
                  drop-shadow-[0_10px_25px_rgba(0,0,0,.35)]
                  xl:h-[82px]
                "
              />
            </div>

            {/* students */}

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                z-[4]
                h-[74%]
                overflow-hidden
              "
            >
              <img
                src="/images/para-students.png"
                alt=""
                aria-hidden="true"
                className="
                  absolute
                  bottom-[-3%]
                  right-[-4%]
                  h-[92%]
                  w-[86%]
                  object-contain
                  object-bottom
                  drop-shadow-[0_25px_30px_rgba(0,0,0,.25)]
                  transition
                  duration-[1000ms]
                  ease-[cubic-bezier(.22,1,.36,1)]
                  group-hover:right-[0%]
                  group-hover:scale-[1.045]
                "
              />
            </div>

            {/* lower readability gradient */}

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                z-[5]
                h-[47%]
                bg-gradient-to-t
                from-[#04182e]
                via-[#04182e]/80
                to-transparent
              "
            />

            {/* content */}

            <div
              className="
                relative
                z-20
                mt-auto
                w-full
                px-12
                pb-14
                xl:px-16
                xl:pb-16
              "
            >
              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/15
                  bg-white/[.08]
                  px-4
                  py-2
                  backdrop-blur-lg
                "
              >
                <GraduationCap
                  size={14}
                  className="text-[#e4b34d]"
                />

                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[.2em]
                    text-white/75
                  "
                >
                  Grades IX – XII
                </span>
              </div>

              <h1
                className="
                  max-w-[470px]
                  font-serif
                  text-[42px]
                  font-semibold
                  leading-[.98]
                  tracking-[-.03em]
                  text-white
                  xl:text-[54px]
                "
              >
                Paragon Senior
                <br />
                Secondary School
              </h1>

              <p
                className="
                  mt-5
                  max-w-[430px]
                  text-[13px]
                  leading-6
                  text-white/65
                  xl:text-sm
                "
              >
                Building knowledge, character and confidence for
                tomorrow's leaders.
              </p>

              <div className="mt-7 flex items-center gap-4">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    bg-white
                    px-6
                    py-3.5
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[.16em]
                    text-[#092d50]
                    shadow-xl
                    transition
                    duration-300
                    group-hover:bg-[#e4b34d]
                  "
                >
                  Enter Senior School

                  <ArrowRight
                    size={16}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </span>
              </div>
            </div>

            {/* hover edge */}

            <span
              className="
                absolute
                bottom-0
                right-0
                top-0
                z-30
                w-[3px]
                bg-[#e4b34d]
                opacity-0
                transition
                duration-500
                group-hover:opacity-100
              "
            />
          </Link>

          {/* =====================================================
              KIDS SCHOOL
          ====================================================== */}

          <Link
            to="/kids"
            className="
              entry-panel
              entry-kids
              group
              relative
              flex
              min-h-screen
              w-1/2
              overflow-hidden
              bg-[#fff7df]
              transition-[width]
              duration-700
              ease-[cubic-bezier(.22,1,.36,1)]
              hover:w-[56%]
            "
          >
            {/* background */}

            <div
              className="
                absolute
                inset-0
                bg-[linear-gradient(145deg,#fffdf6_0%,#fff5d6_47%,#e8f9ff_100%)]
              "
            />

            {/* dots */}

            <div
              className="
                absolute
                inset-0
                opacity-[.18]
                [background-image:radial-gradient(#34305c_1px,transparent_1px)]
                [background-size:26px_26px]
              "
            />

            {/* colourful ambient shapes */}

            <div
              className="
                absolute
                -right-[160px]
                -top-[150px]
                size-[430px]
                rounded-full
                bg-[#ffd34e]/45
              "
            />

            <div
              className="
                absolute
                -right-[95px]
                -top-[85px]
                size-[300px]
                rounded-full
                border-[40px]
                border-white/40
              "
            />

            <div
              className="
                absolute
                -bottom-40
                -left-32
                size-[390px]
                rounded-full
                bg-[#37a9df]/15
              "
            />

            {/* school number */}

            <span
              aria-hidden="true"
              className="
                absolute
                right-[7%]
                top-[14%]
                font-serif
                text-[130px]
                leading-none
                text-[#34305c]/[.045]
              "
            >
              02
            </span>

            {/* logo */}

            <div
              className="
                absolute
                left-12
                top-[12%]
                z-20
                rounded-[22px]
                border
                border-white
                bg-white/90
                p-3
                shadow-[0_15px_40px_-18px_rgba(52,48,92,.3)]
                backdrop-blur
                xl:left-16
              "
            >
              <img
                src="/images/paragon-kids-logo.webp"
                alt="Paragon Kids"
                className="
                  h-[64px]
                  w-auto
                  object-contain
                  xl:h-[72px]
                "
              />
            </div>

            {/* decorative ABC */}

            <span
              className="
                kids-float-a
                absolute
                right-[12%]
                top-[29%]
                z-[3]
                grid
                size-14
                rotate-12
                place-items-center
                rounded-2xl
                bg-[#ef5f6c]
                font-serif
                text-xl
                font-bold
                text-white
                shadow-lg
              "
            >
              A
            </span>

            <span
              className="
                kids-float-star
                absolute
                right-[5%]
                top-[45%]
                z-[3]
                text-3xl
                text-[#f3a625]
              "
            >
              ★
            </span>

            <span
              className="
                kids-float-dot
                absolute
                right-[24%]
                top-[25%]
                z-[3]
                size-3
                rounded-full
                bg-[#20a98b]
              "
            />

            <span
              className="
                kids-float-blue
                absolute
                left-[9%]
                top-[37%]
                z-[3]
                size-4
                rounded-full
                bg-[#37a9df]
              "
            />

            {/* student */}

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                z-[4]
                h-[75%]
                overflow-hidden
              "
            >
              <div
                className="
                  absolute
                  bottom-[5%]
                  right-[5%]
                  size-[330px]
                  rounded-full
                  bg-[#ffd34e]/30
                  transition
                  duration-700
                  group-hover:scale-110
                "
              />

              <img
                src="/images/para-kids-student.png"
                alt=""
                aria-hidden="true"
                className="
                  absolute
                  bottom-[-2%]
                  right-[0%]
                  h-[94%]
                  w-[86%]
                  object-contain
                  object-bottom
                  drop-shadow-[0_25px_30px_rgba(52,48,92,.18)]
                  transition
                  duration-[1000ms]
                  ease-[cubic-bezier(.22,1,.36,1)]
                  group-hover:right-[3%]
                  group-hover:scale-[1.045]
                "
              />
            </div>

            {/* bottom fade */}

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                z-[5]
                h-[48%]
                bg-gradient-to-t
                from-[#fffaf0]
                via-[#fffaf0]/90
                to-transparent
              "
            />

            {/* content */}

            <div
              className="
                relative
                z-20
                mt-auto
                w-full
                px-12
                pb-14
                xl:px-16
                xl:pb-16
              "
            >
              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#ef5f6c]/10
                  bg-white/80
                  px-4
                  py-2
                  shadow-sm
                  backdrop-blur
                "
              >
                <Languages
                  size={14}
                  className="text-[#ef5f6c]"
                />

                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[.2em]
                    text-[#34305c]/65
                  "
                >
                  Nursery · LKG · UKG
                </span>
              </div>

              <h2
                className="
                  font-serif
                  text-[46px]
                  font-semibold
                  leading-[.98]
                  tracking-[-.035em]
                  text-[#34305c]
                  xl:text-[58px]
                "
              >
                Paragon Kids
              </h2>

              <p
                className="
                  mt-5
                  max-w-[400px]
                  text-[13px]
                  leading-6
                  text-[#34305c]/60
                  xl:text-sm
                "
              >
                A joyful beginning where little minds explore,
                imagine, grow and learn.
              </p>

              <div className="mt-7">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-3
                    rounded-full
                    bg-[#34305c]
                    px-6
                    py-3.5
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[.16em]
                    text-white
                    shadow-[0_12px_30px_-10px_rgba(52,48,92,.35)]
                    transition
                    duration-300
                    group-hover:bg-[#ef5f6c]
                  "
                >
                  Enter Paragon Kids

                  <ArrowRight
                    size={16}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </span>
              </div>
            </div>

            <span
              className="
                absolute
                bottom-0
                left-0
                z-30
                h-[5px]
                w-0
                bg-gradient-to-r
                from-[#ef5f6c]
                via-[#ffd34e]
                to-[#37a9df]
                transition-all
                duration-700
                group-hover:w-full
              "
            />
          </Link>

          {/* =====================================================
              CENTER SELECTOR
          ====================================================== */}

          {/* <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              z-40
              -translate-x-1/2
              -translate-y-1/2
            "
          >
            <div
              className="
               
                entry-center
                flex
                size-[86px]
                flex-col
                items-center
                justify-center
                rounded-full
                border-[5px]
                border-white
                bg-[#071b34]
                text-center
                shadow-[0_20px_55px_rgba(0,0,0,.3)]
              "
            >
              <span
                className="
                  text-[7px]
                  font-black
                  uppercase
                  tracking-[.16em]
                  text-white/50
                "
              >
                Choose
              </span>

              <span
                className="
                  mt-0.5
                  font-serif
                  text-[17px]
                  italic
                  text-[#e4b34d]
                "
              >
                your
              </span>

              <span
                className="
                  text-[7px]
                  font-black
                  uppercase
                  tracking-[.16em]
                  text-white/50
                "
              >
                School
              </span>
            </div>
          </div> */}
        </section>

        {/* =========================================================
            MOBILE / TABLET
        ========================================================== */}

        <section
          className="
            flex
            min-h-screen
            flex-col
            pt-[72px]
            lg:hidden
          "
          aria-label="Choose your school"
        >
          {/* mobile heading */}

          <div
            className="
              relative
              z-20
              bg-[#071b34]
              px-5
              pb-6
              pt-5
              text-center
            "
          >
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[.24em]
                text-[#e4b34d]
              "
            >
              Welcome to Paragon
            </p>

            <h1
              className="
                mt-2
                font-serif
                text-3xl
                text-white
                sm:text-4xl
              "
            >
              Choose your school
            </h1>
          </div>

          {/* senior mobile */}

          <Link
            to="/school"
            className="
              group
              relative
              min-h-[360px]
              flex-1
              overflow-hidden
              bg-[#08294a]
              text-white
            "
          >
            <img
              src="/images/paragonmohali_bg.jpg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full object-cover"
            />

            <div
              className="
                absolute
                inset-0
                bg-[linear-gradient(90deg,rgba(4,25,49,.94),rgba(5,35,64,.45))]
              "
            />

            <img
              src="/images/para-students.png"
              alt=""
              aria-hidden="true"
              className="
                absolute
                bottom-0
                right-[-10%]
                h-[83%]
                w-[72%]
                object-contain
                object-bottom
              "
            />

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                h-[70%]
                bg-gradient-to-t
                from-[#04182e]
                via-[#04182e]/55
                to-transparent
              "
            />

            <div
              className="
                relative
                z-10
                flex
                h-full
                min-h-[360px]
                flex-col
                justify-between
                p-6
                sm:p-8
              "
            >
              <img
                src="/images/paragon-school-logo.webp"
                alt="Paragon Senior Secondary School"
                className="h-[58px] w-fit object-contain"
              />

              <div>
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[.2em]
                    text-[#e4b34d]
                  "
                >
                  Grades IX – XII
                </p>

                <h2
                  className="
                    mt-2
                    max-w-[280px]
                    font-serif
                    text-[32px]
                    leading-none
                  "
                >
                  Senior Secondary
                  <br />
                  School
                </h2>

                <span
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-white
                    px-5
                    py-3
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[.13em]
                    text-[#092d50]
                  "
                >
                  Enter School
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>

          {/* kids mobile */}

          <Link
            to="/kids"
            className="
              group
              relative
              min-h-[360px]
              flex-1
              overflow-hidden
              bg-[#fff6d8]
            "
          >
            <div
              className="
                absolute
                inset-0
                bg-[linear-gradient(135deg,#fffdf6,#fff2c9_60%,#e6f8ff)]
              "
            />

            <div
              className="
                absolute
                -right-20
                -top-20
                size-64
                rounded-full
                bg-[#ffd34e]/50
              "
            />

            <span
              className="
                absolute
                right-[8%]
                top-[15%]
                grid
                size-12
                rotate-12
                place-items-center
                rounded-2xl
                bg-[#ef5f6c]
                font-bold
                text-white
              "
            >
              A
            </span>

            <img
              src="/images/para-kids-student.png"
              alt=""
              aria-hidden="true"
              className="
                absolute
                bottom-0
                right-[-8%]
                h-[82%]
                w-[70%]
                object-contain
                object-bottom
              "
            />

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                h-[65%]
                bg-gradient-to-t
                from-[#fffaf0]
                via-[#fffaf0]/55
                to-transparent
              "
            />

            <div
              className="
                relative
                z-10
                flex
                h-full
                min-h-[360px]
                flex-col
                justify-between
                p-6
                sm:p-8
              "
            >
              <div
                className="
                  w-fit
                  rounded-2xl
                  bg-white/90
                  p-2
                  shadow-md
                "
              >
                <img
                  src="/images/paragon-kids-logo.webp"
                  alt="Paragon Kids"
                  className="h-[55px] w-auto"
                />
              </div>

              <div>
                <p
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[.2em]
                    text-[#ef5f6c]
                  "
                >
                  Nursery · LKG · UKG
                </p>

                <h2
                  className="
                    mt-2
                    font-serif
                    text-[36px]
                    leading-none
                    text-[#34305c]
                  "
                >
                  Paragon Kids
                </h2>

                <span
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#34305c]
                    px-5
                    py-3
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[.13em]
                    text-white
                  "
                >
                  Enter Kids
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </section>
      </main>

      {/* =========================================================
          ANIMATIONS
      ========================================================== */}

      <style>{`
        .entry-header {
          opacity: 0;
          transform: translateY(-16px);
          animation: entryHeaderIn .8s .1s ease-out forwards;
        }

        .entry-senior {
          opacity: 0;
          transform: translateX(-35px);
          animation: entrySeniorIn .9s .15s
            cubic-bezier(.22,1,.36,1) forwards;
        }

        .entry-kids {
          opacity: 0;
          transform: translateX(35px);
          animation: entryKidsIn .9s .15s
            cubic-bezier(.22,1,.36,1) forwards;
        }

        .entry-center {
          opacity: 0;
          transform: scale(.7) rotate(-12deg);
          animation: entryCenterIn .75s .65s
            cubic-bezier(.34,1.56,.64,1) forwards;
        }

        .kids-float-a {
          animation: kidsEntryA 4s ease-in-out infinite;
        }

        .kids-float-star {
          animation: kidsEntryStar 3s ease-in-out infinite;
        }

        .kids-float-dot {
          animation: kidsEntryDot 3.7s .5s ease-in-out infinite;
        }

        .kids-float-blue {
          animation: kidsEntryDot 4.2s ease-in-out infinite;
        }

        @keyframes entryHeaderIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes entrySeniorIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes entryKidsIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes entryCenterIn {
          to {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        @keyframes kidsEntryA {
          0%, 100% {
            transform: translateY(0) rotate(12deg);
          }

          50% {
            transform: translateY(-14px) rotate(4deg);
          }
        }

        @keyframes kidsEntryStar {
          0%, 100% {
            transform: scale(1) rotate(0);
            opacity: .7;
          }

          50% {
            transform: scale(1.25) rotate(16deg);
            opacity: 1;
          }
        }

        @keyframes kidsEntryDot {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-12px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .entry-header,
          .entry-senior,
          .entry-kids,
          .entry-center,
          .kids-float-a,
          .kids-float-star,
          .kids-float-dot,
          .kids-float-blue {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }

          .entry-panel {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}