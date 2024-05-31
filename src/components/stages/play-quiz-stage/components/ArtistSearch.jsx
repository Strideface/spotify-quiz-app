import SearchBar from "./SearchBar";

export default function ArtistSearch({ setUserResponse }) {


  return (
    <div className=" flex flex-row">
      <h2>Artist:</h2>
      <SearchBar type="artist"/>
    </div>
  );
}
