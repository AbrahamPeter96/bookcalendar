"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TimeSlot from "./TimeSlot";
import CalendarDay from "./CalendarDay";
import { MultiSelect } from "react-multi-select-component";

const serviceOptions = [
  { label: "Haircut", value: "Haircut" },
  { label: "Manicure", value: "Manicure" },
  { label: "Facial Massage", value: "Facial Massage" },
];

const Calendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    customer: "",
    services: [],
    start: "",
    end: "",
    day: null,
    color: "bg-pink-500",
    status: "Need Approval",
  });
  const [eventList, setEventList] = useState([]);

  const hours = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6;
    return {
      time: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`,
      hour24: hour,
    };
  });

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentWeek);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const handleTimeClick = (hour24, dayIndex) => {
    setNewEvent({
      ...newEvent,
      start: `${hour24}:00`,
      end: `${hour24 + 1}:00`,
      day: dayIndex,
    });
    setIsModalOpen(true);
  };

  return (
    <Card className="w-full overflow-hidden shadow-lg">
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Clock className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {weekStart.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek("prev")}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentWeek(new Date())}
              className="px-3"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek("next")}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-b">
        <div className="grid grid-cols-8 min-h-[60px]">
          <div className="border-r border-gray-200 bg-white"></div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="border-r border-gray-200 last:border-r-0 p-3 text-center bg-white"
            >
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={`text-2xl font-bold mt-1 ${
                  day.toDateString() === new Date().toDateString()
                    ? "text-blue-600"
                    : "text-gray-900"
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-8">
          <div className="bg-gray-50 border-r border-gray-200">
            {hours.map((hour, index) => (
              <TimeSlot key={index} time={hour.time} />
            ))}
          </div>

          {weekDays.map((day, dayIndex) => (
            <CalendarDay
              key={dayIndex}
              day={day}
              dayIndex={dayIndex}
              hours={hours}
              events={eventList.filter((event) => event.day === dayIndex)}
              onTimeClick={handleTimeClick}
            />
          ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Customer</Label>
              <Input
                value={newEvent.customer}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, customer: e.target.value })
                }
                placeholder="Search or enter customer name"
              />
            </div>
            <div>
              <Label>Services</Label>
              <MultiSelect
                options={serviceOptions}
                value={newEvent.services}
                onChange={(values) =>
                  setNewEvent({ ...newEvent, services: values })
                }
                labelledBy="Select"
              />
            </div>
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={newEvent.start}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, start: e.target.value })
                }
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={newEvent.end}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, end: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={newEvent.status}
                onValueChange={(value) =>
                  setNewEvent({ ...newEvent, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Need Approval">Need Approval</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => {
                const finalEvent = {
                  ...newEvent,
                  id: Date.now(),
                  title: `${newEvent.customer} (${newEvent.services
                    .map((s) => s.label)
                    .join(", ")})`,
                };
                setEventList([...eventList, finalEvent]);
                setIsModalOpen(false);
              }}
            >
              Save Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Calendar;
