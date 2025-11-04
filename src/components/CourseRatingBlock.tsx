import React, { useState } from "react";
import { Star } from "lucide-react";
import { useRateCourse } from "../hooks/useRateCourses";
import { useCourseRatingInfo } from "../hooks/useCourseRatingInfo";

export function CourseRatingBlock({ courseId }: { courseId: number }) {
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const rateMutation = useRateCourse(courseId);
  const { data: ratingInfo, refetch } = useCourseRatingInfo(courseId);

  const handleRate = (star: number) => {
    setSelected(star);
    rateMutation.mutate(
      { rating: star },
      {
        onSuccess: () => {
          setSubmitted(true);
          refetch();
        }
      }
    );
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-center mb-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`mx-1`}
            disabled={submitted}
            onClick={() => handleRate(star)}
            aria-label={`${star} yıldız ver`}
          >
            <Star
              fill={selected >= star ? "#fbbf24" : "#e5e7eb"}
              color="#fbbf24"
              className="h-8 w-8"
            />
          </button>
        ))}
      </div>
      {ratingInfo && (
        <div className="text-center text-sm text-gray-600">
          {`Ortalama: ${ratingInfo.average_rating} / Oy sayısı: ${ratingInfo.rating_count}`}
        </div>
      )}
      {submitted && (
        <div className="text-green-600 text-center mt-2">Teşekkürler! Oyunuz alındı.</div>
      )}
      {rateMutation.isError && (
        <div className="text-red-500 text-xs text-center mt-2">Hata oluştu, lütfen tekrar deneyin.</div>
      )}
    </div>
  );
}