import { Navigate, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from '../components/ScrollToTop'
import { AcademicsPage } from '../features/school/pages/academics/AcademicsPage'
import { ActivitiesPage } from '../features/school/pages/activities/ActivitiesPage'
import { ClubActivitiesPage } from '../features/school/pages/activities/ClubActivitiesPage'
import { FlashbacksPage } from '../features/school/pages/activities/FlashbacksPage'
import { HouseActivitiesPage } from '../features/school/pages/activities/HouseActivitiesPage'
import { AdmissionsPage } from '../features/school/pages/admissions/AdmissionsPage'
import { BooksListPage } from '../features/school/pages/admissions/BooksListPage'
import { SchoolLeavingCertificatePage } from '../features/school/pages/admissions/SchoolLeavingCertificatePage'
import { AboutDirectorPage } from '../features/school/pages/about/AboutDirectorPage'
import { AboutPage } from '../features/school/pages/about/AboutPage'
import { DirectorsDeskPage } from '../features/school/pages/about/DirectorsDeskPage'
import { FounderPage } from '../features/school/pages/about/FounderPage'
import { HistoryLegacyPage } from '../features/school/pages/about/HistoryLegacyPage'
import { InfrastructurePage } from '../features/school/pages/about/InfrastructurePage'
import { MissionVisionPage } from '../features/school/pages/about/MissionVisionPage'
import { PresidentsDeskPage } from '../features/school/pages/about/PresidentsDeskPage'
import { PrincipalsDeskPage } from '../features/school/pages/about/PrincipalsDeskPage'
import { ContactPage } from '../features/school/pages/ContactPage'
import { GalleryPage } from '../features/school/pages/GalleryPage'
import { GalleryCategoryPage } from '../features/school/pages/gallery/GalleryCategoryPage'
import { MandatoryDisclosurePage } from '../features/school/pages/MandatoryDisclosurePage'
import { SchoolUniformPage } from '../features/school/pages/SchoolUniformPage'
import { SchoolLayout } from '../features/school/layouts/SchoolLayout'
import { SchoolHomePage } from '../features/school/pages/SchoolHomePage'
import { ExcursionPage } from '../features/school/pages/beyond-classroom/ExcursionPage'
import { GermanLanguagePage } from '../features/school/pages/beyond-classroom/GermanLanguagePage'
import { ImportantDaysPage } from '../features/school/pages/beyond-classroom/ImportantDaysPage'
import { NccPage } from '../features/school/pages/beyond-classroom/NccPage'
import { NdaPage } from '../features/school/pages/beyond-classroom/NdaPage'
import { NssPage } from '../features/school/pages/beyond-classroom/NssPage'
import { RedCrossUnitPage } from '../features/school/pages/beyond-classroom/RedCrossUnitPage'
import { ScoutsAndGuidesPage } from '../features/school/pages/beyond-classroom/ScoutsAndGuidesPage'
import { KidsLayout } from '../features/kids/layouts/KidsLayout'
import { KidsHomePage } from '../features/kids/pages/KidsHomePage'
import { KidsAboutPage } from '../features/kids/pages/KidsAboutPage'
import { KidsAboutDirectorPage } from '../features/kids/pages/KidsAboutDirectorPage'
import { KidsAboutParagonPage } from '../features/kids/pages/KidsAboutParagonPage'
import { KidsActivitiesPage } from '../features/kids/pages/KidsActivitiesPage'
import { KidsAdmissionPage } from '../features/kids/pages/KidsAdmissionPage'
import { KidsContactPage } from '../features/kids/pages/KidsContactPage'
import { KidsCurriculumPage } from '../features/kids/pages/KidsCurriculumPage'
import { KidsDisclosurePage } from '../features/kids/pages/KidsDisclosurePage'
import { KidsFounderPage } from '../features/kids/pages/KidsFounderPage'
import { KidsGalleryPage } from '../features/kids/pages/KidsGalleryPage'
import { KidsGalleryCategoryPage } from '../features/kids/pages/gallery/KidsGalleryCategoryPage'
import { KidsHistoryLegacyPage } from '../features/kids/pages/KidsHistoryLegacyPage'
import { KidsInfrastructurePage } from '../features/kids/pages/KidsInfrastructurePage'
import { KidsMissionVisionPage } from '../features/kids/pages/KidsMissionVisionPage'
import { KidsPresidentsDeskPage } from '../features/kids/pages/KidsPresidentsDeskPage'
import { KidsPrincipalsDeskPage } from '../features/kids/pages/KidsPrincipalsDeskPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { SchoolSelectorPage } from '../pages/SchoolSelectorPage'

export function AppRoutes() {
  return <><ScrollToTop /><Routes>
    <Route index element={<SchoolSelectorPage />} />
    <Route path="school" element={<SchoolLayout />}>
      <Route index element={<SchoolHomePage />} />
      <Route path="german-language-teaching" element={<GermanLanguagePage />} />
      <Route path="german-language" element={<Navigate replace to="/school/german-language-teaching" />} />
      <Route path="red-cross-unit" element={<RedCrossUnitPage />} />
      <Route path="nss" element={<NssPage />} />
      <Route path="ncc" element={<NccPage />} />
      <Route path="excursion" element={<ExcursionPage />} />
      <Route path="important-days" element={<ImportantDaysPage />} />
      <Route path="scouts-and-guides" element={<ScoutsAndGuidesPage />} />
      <Route path="nda" element={<NdaPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="about/history-and-legacy" element={<HistoryLegacyPage />} />
      <Route path="about/mission-and-vision" element={<MissionVisionPage />} />
      <Route path="about/founder" element={<FounderPage />} />
      <Route path="about/presidents-desk" element={<PresidentsDeskPage />} />
      <Route path="about/directors-desk" element={<DirectorsDeskPage />} />
      <Route path="about/about-director" element={<AboutDirectorPage />} />
      <Route path="about/principals-desk" element={<PrincipalsDeskPage />} />
      <Route path="about/infrastructure" element={<InfrastructurePage />} />
      <Route path="academics" element={<AcademicsPage />} />
      <Route path="admission" element={<AdmissionsPage />} />
      <Route path="admissions" element={<Navigate replace to="/school/admission" />} />
      <Route path="list-of-books" element={<BooksListPage />} />
      <Route path="admissions/books-list" element={<Navigate replace to="/school/list-of-books" />} />
      <Route path="school-leaving-certificate" element={<SchoolLeavingCertificatePage />} />
      <Route path="admissions/school-leaving-certificate" element={<Navigate replace to="/school/school-leaving-certificate" />} />
      <Route path="school-uniform" element={<SchoolUniformPage />} />
      <Route path="activities" element={<ActivitiesPage />} />
      <Route path="flashbacks" element={<FlashbacksPage />} />
      <Route path="activities/flashbacks" element={<Navigate replace to="/school/flashbacks" />} />
      <Route path="club-activities" element={<ClubActivitiesPage />} />
      <Route path="activities/club-activities" element={<Navigate replace to="/school/club-activities" />} />
      <Route path="houses-activities" element={<HouseActivitiesPage />} />
      <Route path="activities/house-activities" element={<Navigate replace to="/school/houses-activities" />} />
      <Route path="gallery" element={<GalleryPage />} />
      <Route path="gallery/:categorySlug" element={<GalleryCategoryPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="mandatory-disclosure-information" element={<MandatoryDisclosurePage />} />
      <Route path="mandatory-disclosure" element={<Navigate replace to="/school/mandatory-disclosure-information" />} />
    </Route>
    <Route path="kids" element={<KidsLayout />}>
      <Route index element={<KidsHomePage />} />
      <Route path="about" element={<KidsAboutPage />} />
      <Route path="about/mission-and-vision" element={<KidsMissionVisionPage />} />
      <Route path="about/principals-desk" element={<KidsPrincipalsDeskPage />} />
      <Route path="about/history-and-legacy" element={<KidsHistoryLegacyPage />} />
      <Route path="about/curriculum" element={<KidsCurriculumPage />} />
      <Route path="about/founder" element={<KidsFounderPage />} />
      <Route path="about/infrastructure" element={<KidsInfrastructurePage />} />
      <Route path="about/presidents-desk" element={<KidsPresidentsDeskPage />} />
      <Route path="about/about-director" element={<KidsAboutDirectorPage />} />
      <Route path="about/about-paragon-kids" element={<KidsAboutParagonPage />} />
      <Route path="admission" element={<KidsAdmissionPage />} />
      <Route path="activities" element={<KidsActivitiesPage />} />
      <Route path="gallery" element={<KidsGalleryPage />} />
      <Route path="gallery/:categorySlug" element={<KidsGalleryCategoryPage />} />
      <Route path="contact" element={<KidsContactPage />} />
      <Route path="mandatory-disclosure" element={<KidsDisclosurePage />} />
      </Route>
    {['about', 'academics', 'admissions', 'activities', 'gallery', 'contact'].map((path) => <Route key={path} path={path} element={<Navigate replace to={`/school/${path}`} />} />)}
    <Route path="*" element={<NotFoundPage />} />
  </Routes></>
}










