package com.example.locationtest;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

public class ListOfIncidents {

    private List<Incident> incidentList = new List<Incident>() {
        @Override
        public int size() {
            return 0;
        }

        @Override
        public boolean isEmpty() {
            return false;
        }

        @Override
        public boolean contains(@Nullable Object o) {
            return false;
        }

        @NonNull
        @Override
        public Iterator<Incident> iterator() {
            return null;
        }

        @NonNull
        @Override
        public Object[] toArray() {
            return new Object[0];
        }

        @NonNull
        @Override
        public <T> T[] toArray(@NonNull T[] a) {
            return null;
        }

        @Override
        public boolean add(Incident incident) {
            return false;
        }

        @Override
        public boolean remove(@Nullable Object o) {
            return false;
        }

        @Override
        public boolean containsAll(@NonNull Collection<?> c) {
            return false;
        }

        @Override
        public boolean addAll(@NonNull Collection<? extends Incident> c) {
            return false;
        }

        @Override
        public boolean addAll(int index, @NonNull Collection<? extends Incident> c) {
            return false;
        }

        @Override
        public boolean removeAll(@NonNull Collection<?> c) {
            return false;
        }

        @Override
        public boolean retainAll(@NonNull Collection<?> c) {
            return false;
        }

        @Override
        public void clear() {

        }

        @Override
        public Incident get(int index) {
            return null;
        }

        @Override
        public Incident set(int index, Incident element) {
            return null;
        }

        @Override
        public void add(int index, Incident element) {

        }

        @Override
        public Incident remove(int index) {
            return null;
        }

        @Override
        public int indexOf(@Nullable Object o) {
            return 0;
        }

        @Override
        public int lastIndexOf(@Nullable Object o) {
            return 0;
        }

        @NonNull
        @Override
        public ListIterator<Incident> listIterator() {
            return null;
        }

        @NonNull
        @Override
        public ListIterator<Incident> listIterator(int index) {
            return null;
        }

        @NonNull
        @Override
        public List<Incident> subList(int fromIndex, int toIndex) {
            return null;
        }
    };

    public List<Incident> getIncidentList(){
        return incidentList;
    }

}
