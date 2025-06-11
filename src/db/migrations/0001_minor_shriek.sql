CREATE INDEX `activities_trip_id_idx` ON `activities` (`trip_id`);--> statement-breakpoint
CREATE INDEX `activities_date_idx` ON `activities` (`date`);--> statement-breakpoint
CREATE INDEX `packing_items_list_id_idx` ON `packing_items` (`list_id`);--> statement-breakpoint
CREATE INDEX `packing_items_category_idx` ON `packing_items` (`category`);--> statement-breakpoint
CREATE INDEX `packing_items_packed_idx` ON `packing_items` (`is_packed`);--> statement-breakpoint
CREATE INDEX `packing_lists_trip_id_idx` ON `packing_lists` (`trip_id`);--> statement-breakpoint
CREATE INDEX `trips_name_idx` ON `trips` (`name`);--> statement-breakpoint
CREATE INDEX `trips_start_date_idx` ON `trips` (`start_date`);