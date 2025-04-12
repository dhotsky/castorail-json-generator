document.getElementById('generate-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const dateInput = document.getElementById('date').value;
    const versionInput = document.getElementById('version').value;

    if (!dateInput || !versionInput) {
        alert('Mohon masukkan tanggal dan versi dengan benar.');
        return;
    }

    // Validasi format versi: angka.angka
    const versionRegex = /^\d+\.\d+$/;
    if (!versionRegex.test(versionInput)) {
        alert('Format versi tidak valid. Gunakan format angka seperti "3.0"');
        return;
    }

    let [mainVersion, subVersion] = versionInput.split('.').map(Number);
    let dripMarketingDate = new Date(dateInput);
    let datasets = [];

    const addDays = (date, days) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    };

    for (let i = 0; i < 10; i++) {
        const dmVersion = `${mainVersion}.${subVersion}`;

        // Hitung versi sebelumnya
        let spMain = mainVersion;
        let spSub = subVersion - 1;
        if (spSub < 0) {
            spMain -= 1;
            spSub = 9;
        }
        const spVersion = `${spMain}.${spSub}`;

        const dripMarketing = toCustomISOString(dripMarketingDate);
        const specialProgram = toCustomISOString(addDays(dripMarketingDate, 3));
        const update = toCustomISOString(addDays(dripMarketingDate, 15));

        const dataset = {
            [`Drip Marketing ${dmVersion}`]: dripMarketing,
            [`Special Program ${spVersion}`]: specialProgram,
            [`Update ${spVersion}`]: update
        };

        datasets.push(dataset);

        // Tambah 1 sub versi
        subVersion++;
        if (subVersion > 9) {
            subVersion = 0;
            mainVersion++;
        }

        // Tambah 42 hari untuk drip berikutnya
        dripMarketingDate = addDays(dripMarketingDate, 42);
    }

    const jsonOutput = JSON.stringify(datasets, null, 4);
    document.getElementById('json-output').textContent = jsonOutput;

    // Simpan untuk di-download
    window.generatedJSON = jsonOutput;
    document.getElementById('download-btn').style.display = 'inline-block';
});

document.getElementById('download-btn').addEventListener('click', function () {
    if (!window.generatedJSON) return;

    const blob = new Blob([window.generatedJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_data.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Format ISO8601 dengan offset UTC+7
function toCustomISOString(date, offsetMinutes = 420) {
    const offsetMs = offsetMinutes * 60 * 1000;
    const localDate = new Date(date.getTime() + offsetMs);

    const pad = (num) => String(num).padStart(2, '0');
    const year = localDate.getUTCFullYear();
    const month = pad(localDate.getUTCMonth() + 1);
    const day = pad(localDate.getUTCDate());
    const hours = pad(localDate.getUTCHours());
    const minutes = pad(localDate.getUTCMinutes());
    const seconds = pad(localDate.getUTCSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+07:00`;
}
