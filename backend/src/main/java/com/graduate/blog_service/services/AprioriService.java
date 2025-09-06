package com.graduate.blog_service.services;

import ca.pfv.spmf.algorithms.frequentpatterns.apriori.AlgoApriori;
import com.graduate.blog_service.Dto.apriori.BookingItemsDto;
import com.graduate.blog_service.Dto.apriori.FrequentItemsetDto;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.PrintWriter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Scanner;
@Service
public class AprioriService {

    public List<FrequentItemsetDto> runApriori(List<BookingItemsDto> bookings, double minSupport) throws Exception {
        // Map items to integer IDAs
        Map<String, Integer> itemToId = new HashMap<>();
        Map<Integer, String> idToItem = new HashMap<>();
        int idCounter = 1;

        for (BookingItemsDto booking : bookings) {
            for (String item : booking.getAllItems()) {
                if (!itemToId.containsKey(item)) {
                    itemToId.put(item, idCounter);
                    idToItem.put(idCounter, item);
                    idCounter++;
                }
            }
        }

        // Write transactions to a temporary input file
        File inputFile = File.createTempFile("bookings_input", ".txt");
        try (PrintWriter pw = new PrintWriter(inputFile)) {
            for (BookingItemsDto booking : bookings) {
                List<Integer> ids = booking.getAllItems().stream()
                        .map(itemToId::get)
                        .toList();
                pw.println(ids.stream().map(String::valueOf).collect(Collectors.joining(" ")));
            }
        }

        // Temporary output file
        File outputFile = File.createTempFile("bookings_output", ".txt");

        // Run Apriori
        AlgoApriori apriori = new AlgoApriori();
        apriori.runAlgorithm(minSupport, inputFile.getAbsolutePath(), outputFile.getAbsolutePath());
        apriori.printStats();

        // Parse output file
        List<FrequentItemsetDto> result = new ArrayList<>();
        try (Scanner sc = new Scanner(outputFile)) {
            while (sc.hasNextLine()) {
                String line = sc.nextLine().trim();
                if (!line.contains("#SUP:")) continue;
                String[] parts = line.split("#SUP:");
                String[] itemIds = parts[0].trim().split(" ");
                int support = Integer.parseInt(parts[1].trim());

                List<String> items = Arrays.stream(itemIds)
                        .map(id -> idToItem.get(Integer.parseInt(id)))
                        .collect(Collectors.toList());

                result.add(new FrequentItemsetDto(items, support));
            }
        }

        return result;
    }
}
